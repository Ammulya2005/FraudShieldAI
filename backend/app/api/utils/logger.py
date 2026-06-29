import logging

from backend.app.core.config import LOG_LEVEL


def setup_logger():

    logging.basicConfig(
        level=LOG_LEVEL,
        format=(
            "%(asctime)s - "
            "%(name)s - "
            "%(levelname)s - "
            "%(message)s"
        )
    )

    return logging.getLogger("FraudShieldAI")


logger = setup_logger()