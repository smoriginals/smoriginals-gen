export function smosHello() {
    return "smoriginals-gen is running..."
}
export function trimContext(code: string, maxLines = 200) {
    return code.split('\n').slice(-maxLines).join('\n')
}
export function version() {
    return "0.1.0"
}