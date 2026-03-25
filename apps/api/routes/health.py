import fastapi

router = fastapi.APIRouter()


@router.get("/health")
async def health_check():
    return {"status": "ok"}
