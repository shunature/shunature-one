export async function onRequest(context) {
    const url = new URL(context.request.url);
    const path = url.pathname;
    
    // /blog/:tag/:slug → /blog/p/:tag/:slug にrewrite
    const match = path.match(/^\/blog\/([^/]+)\/([^/]+)\/?$/);
    if (match) {
        url.pathname = `/blog/p/${match[1]}/${match[2]}/`;
        return fetch(url.toString(), context.request);
    }
    
    return context.next();
}