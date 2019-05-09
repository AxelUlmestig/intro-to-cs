// this leads to a contradiction if willHalt exists
const f = willHalt => {
    while(willHalt(f)) {}

    return "halt"
}

