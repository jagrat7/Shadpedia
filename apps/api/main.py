import fastapi
import inngest.fast_api

from workflows.client import inngest_client
from workflows.functions import all_functions
from routes import health

app = fastapi.FastAPI(title="Shadpedia API")

app.include_router(health.router)

inngest.fast_api.serve(app, inngest_client, all_functions)
