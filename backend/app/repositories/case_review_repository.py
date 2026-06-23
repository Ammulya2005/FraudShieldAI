from backend.database.mongodb import db
from backend.app.core.config import (
    CASE_REVIEWS_COLLECTION
)


async def create_case_review(review_data: dict):
    result = await db[
        CASE_REVIEWS_COLLECTION
    ].insert_one(review_data)

    return str(result.inserted_id)


async def get_all_case_reviews():
    reviews = []

    async for review in db[
        CASE_REVIEWS_COLLECTION
    ].find().sort("created_at", -1):
        review["_id"] = str(review["_id"])
        reviews.append(review)

    return reviews


async def get_case_review_by_review_id(
    review_id: str
):
    review = await db[
        CASE_REVIEWS_COLLECTION
    ].find_one(
        {"review_id": review_id}
    )

    if review:
        review["_id"] = str(review["_id"])

    return review


async def get_case_reviews_by_case_id(
    case_id: str
):
    reviews = []

    async for review in db[
        CASE_REVIEWS_COLLECTION
    ].find(
        {"case_id": case_id}
    ).sort("created_at", -1):
        review["_id"] = str(review["_id"])
        reviews.append(review)

    return reviews


async def update_case_review(
    review_id: str,
    update_data: dict
):
    result = await db[
        CASE_REVIEWS_COLLECTION
    ].update_one(
        {"review_id": review_id},
        {
            "$set": update_data
        }
    )

    return result.modified_count


async def delete_case_review(
    review_id: str
):
    result = await db[
        CASE_REVIEWS_COLLECTION
    ].delete_one(
        {"review_id": review_id}
    )

    return result.deleted_count


async def get_case_review_count():
    return await db[
        CASE_REVIEWS_COLLECTION
    ].count_documents({})