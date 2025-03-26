from typing import Annotated
import os
from nexify import Body, Nexify
from nexify.responses import JSONResponse
from pydantic import BaseModel, Field


def cors_middleware(route, event, context, call_next):
    response = call_next(event, context)
    response.headers["Access-Control-Allow-Origin"] = "https://decompiler-25spring-door-quiz.junah.dev"
    response.headers["Access-Control-Allow-Methods"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "*"
    return response


app = Nexify(middlewares=[cors_middleware])

flag1 = os.environ.get('FLAG1', "1")
flag2 = os.environ.get('FLAG2', "2")
DOOR_PASSWORD = os.environ.get('DOOR_PASSWORD')


class Flags(BaseModel):
    flag1: Annotated[str, Field(min_length=2, max_length=512)]
    flag2: Annotated[str, Field(min_length=2, max_length=512)]


class SolveResponse(BaseModel):
    password: str


@app.post("/solve")
def solve(flags: Annotated[Flags, Body()]):
    if flags.flag1 != flag1 or flags.flag2 != flag2:
        return JSONResponse(
            status_code=400,
            content={"detail": "Invalid flags"}
        )

    return SolveResponse(password=DOOR_PASSWORD)
