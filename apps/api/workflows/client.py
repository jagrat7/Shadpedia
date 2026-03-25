import os

import inngest

inngest_client = inngest.Inngest(
    app_id="shadpedia",
    is_production=os.getenv("INNGEST_DEV") is None,
)
