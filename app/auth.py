"""
Authentication and RBAC for the SOAR Incident Containment Engine.

Password hashing uses stdlib PBKDF2-HMAC-SHA256 (no extra dependency like
bcrypt/passlib needed). JWTs use PyJWT, which was already in requirements.txt.
"""

import hashlib
import hmac
import os
import secrets
import time

import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

# In production this should come from an environment variable, not a literal
# default -- the default here only exists so the app still runs in a fresh
# dev checkout without extra setup.
SECRET_KEY = os.getenv("JWT_SECRET_KEY", "dev-secret-change-this-in-production")
ALGORITHM = "HS256"
TOKEN_EXPIRY_SECONDS = 60 * 60 * 8  # 8 hours

bearer_scheme = HTTPBearer()


# ---------------------------------------------------------------------------
# Password hashing
# ---------------------------------------------------------------------------

def hash_password(password: str, salt: str = None) -> str:
    """Return 'salt$hash' using PBKDF2-HMAC-SHA256 with 100k iterations."""
    salt = salt or secrets.token_hex(16)
    digest = hashlib.pbkdf2_hmac(
        "sha256", password.encode(), salt.encode(), 100_000
    )
    return f"{salt}${digest.hex()}"


def verify_password(password: str, stored_hash: str) -> bool:
    try:
        salt, digest_hex = stored_hash.split("$")
    except ValueError:
        return False

    new_digest = hashlib.pbkdf2_hmac(
        "sha256", password.encode(), salt.encode(), 100_000
    )
    # constant-time comparison -- avoids leaking info via timing
    return hmac.compare_digest(new_digest.hex(), digest_hex)


# ---------------------------------------------------------------------------
# JWT issuing
# ---------------------------------------------------------------------------

def create_access_token(username: str, role: str) -> str:
    payload = {
        "sub": username,
        "role": role,
        "exp": int(time.time()) + TOKEN_EXPIRY_SECONDS
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


# ---------------------------------------------------------------------------
# Request-time auth dependencies
# ---------------------------------------------------------------------------

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme)
) -> dict:
    """Decode the bearer token and return {'username': ..., 'role': ...}."""

    token = credentials.credentials

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return {"username": payload["sub"], "role": payload["role"]}

    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired, please log in again"
        )
    except jwt.InvalidTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication token"
        )


def require_role(*allowed_roles: str):
    """
    Dependency factory: require_role("senior_analyst") returns a dependency
    that 403s unless the caller's role is in allowed_roles.
    """

    def role_checker(current_user: dict = Depends(get_current_user)) -> dict:
        if current_user["role"] not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=(
                    f"Role '{current_user['role']}' is not permitted to "
                    f"perform this action. Requires one of: {', '.join(allowed_roles)}"
                )
            )
        return current_user

    return role_checker