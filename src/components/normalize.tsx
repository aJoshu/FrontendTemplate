export function normalize(string:string) {
    return string.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "");
}