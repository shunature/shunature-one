export async function onRequest(context) {
    const url = new URL(context.request.url);
    const path = url.pathname;
    
    // thumbnailsや静的ファイルはスキップ
    if (path.startsWith('/blog/thumbnails/') || path.match(/\.[a-z]+$/i)) {
        return context.next();
    }

    const match = path.match(/^\/blog\/([^/]+)\/([^/]+)\/?$/);
    if (match) {
        url.pathname = `/blog/p/${match[1]}/${match[2]}/`;
        return fetch(url.toString(), context.request);
    }
    
    return context.next();
}