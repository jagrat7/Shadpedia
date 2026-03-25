import inngest

from workflows.client import inngest_client


@inngest_client.create_function(
    fn_id="hello-world",
    trigger=inngest.TriggerEvent(event="test/hello"),
)
async def hello_world(ctx: inngest.Context) -> str:
    return "Hello from Shadpedia!"


all_functions = [hello_world]
