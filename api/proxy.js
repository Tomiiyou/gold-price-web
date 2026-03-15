export default async function handler(req, res) {
    // 核心防御机制：Vercel 边缘缓存 (Edge Caching)
    // s-maxage=60 表示：Vercel 会把抓取到的价格缓存 60 秒。
    // 这 60 秒内不管有多少客户刷新您的网页，都直接从缓存读取，绝对不会去打扰 beijingrtj.com，从而完美防止被对方封禁 IP。
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=120');
    res.setHeader('Access-Control-Allow-Origin', '*');

    try {
        // 模拟正常浏览器的请求，防止被识别为机器人
        const response = await fetch('[http://beijingrtj.com/](http://beijingrtj.com/)', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8'
            }
        });

        if (!response.ok) {
            throw new Error('Target site error: ' + response.status);
        }

        const html = await response.text();
        
        // 将目标网站的源码原封不动地返回给我们的前端
        res.status(200).send(html);
    } catch (error) {
        console.error("抓取失败:", error);
        res.status(500).json({ error: 'Failed to fetch data' });
    }
}
