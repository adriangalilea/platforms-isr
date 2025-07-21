import { NextApiHandler } from "next";

const handler: NextApiHandler = async (req, res) => {
  try {
    const { subdomain } = req.query;
    
    if (!subdomain || typeof subdomain !== 'string') {
      return res.status(400).json({ error: 'Subdomain parameter required' });
    }
    
    const pathToRevalidate = `/s/${subdomain}`;
    console.log(`[PAGES API] Attempting to revalidate: ${pathToRevalidate}`);
    
    // Use res.revalidate (this DOES work for specific dynamic routes)
    await res.revalidate(pathToRevalidate);
    
    return res.json({ 
      revalidated: true, 
      path: pathToRevalidate,
      timestamp: new Date().toISOString(),
      method: 'Pages Router res.revalidate'
    });
  } catch (err) {
    console.error("[PAGES API] Error revalidating:", err);
    return res.status(500).json({ 
      error: "Error revalidating",
      message: err instanceof Error ? err.message : 'Unknown error'
    });
  }
};

export default handler;