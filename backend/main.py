from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from typing import List, Optional
import time

app = FastAPI(
    title="Bizkitgrow Companion AI & Optimization Service",
    description="Python FastAPI backend powering scraping pipelines, NLP rewriting, and routing optimization solvers.",
    version="1.0.0"
)

# --- NLP Paraphrase Models ---
class ParaphraseRequest(BaseModel):
    text: str = Field(..., description="Raw text/markdown to rewrite")
    pillar: str = Field("connectivity", description="Pillar to align tone with (connectivity, reputation, intelligence, solutions)")
    audience: str = Field("remote professionals", description="Target audience characteristics")

class ParaphraseResponse(BaseModel):
    polished_text: str = Field(..., description="High-converting, polished English copy")
    reading_time_mins: int
    seo_keywords: List[str]

# --- Route Optimization Models ---
class Node(BaseModel):
    id: str
    latency_ms: float
    bandwidth_mbps: float
    cost_usd: float

class OptimizationRequest(BaseModel):
    nodes: List[Node]
    target_country: str
    max_latency_ms: float = 150.0

class OptimizationResponse(BaseModel):
    optimal_route: List[str] = Field(..., description="Ordered list of optimal node IDs for traffic routing")
    total_cost_usd: float
    estimated_latency_ms: float
    status: str

# --- Scraper Intelligence Models ---
class ScraperRequest(BaseModel):
    target_url: str
    scrape_type: str = Field("competitor", description="Type of scraping task (competitor, market, lead)")

class ScrapeResult(BaseModel):
    title: str
    headings: List[str]
    detected_features: List[str]
    estimated_traffic_score: float

# --- REST Endpoints ---

@app.get("/")
def read_root():
    return {
        "status": "online",
        "service": "Bizkitgrow Companion Backend",
        "timestamp": time.time()
    }

@app.post("/api/v1/paraphrase", response_model=ParaphraseResponse)
def paraphrase_text(req: ParaphraseRequest):
    """
    Polishes raw scraped text into enterprise-grade English copy aligned with 
    the selected branding pillar.
    """
    if not req.text.strip():
        raise HTTPException(status_code=400, detail="Text payload cannot be empty.")
    
    # Mocking NLP pipeline processing
    tone = req.pillar.upper()
    polished_copy = (
        f"[POLISHED BRIEFING: ALIGNED WITH {tone}]\n\n"
        f"Security and high-speed uptime are non-negotiable for modern professionals. "
        f"Our analysis confirms that accessing corporate platforms from unverified public networks "
        f"risks credential leakage and critical compromise. Here is a curated briefing:\n\n"
        f"{req.text}\n\n"
        f"Establish a secure tunnel to guarantee continuous, zero-friction global operations."
    )
    
    return ParaphraseResponse(
        polished_text=polished_copy,
        reading_time_mins=max(1, len(req.text) // 1000),
        seo_keywords=["global eSIM", "secure VPN network", "remote team security", "enterprise connectivity"]
    )

@app.post("/api/v1/optimize-routing", response_model=OptimizationResponse)
def optimize_routing(req: OptimizationRequest):
    """
    Solves network path cost-minimization problems under strict latency constraints.
    """
    if not req.nodes:
        raise HTTPException(status_code=400, detail="Node list cannot be empty.")
    
    # Filter nodes by maximum acceptable latency
    valid_nodes = [n for n in req.nodes if n.latency_ms <= req.max_latency_ms]
    
    if not valid_nodes:
        return OptimizationResponse(
            optimal_route=[],
            total_cost_usd=0.0,
            estimated_latency_ms=0.0,
            status="No path satisfies latency constraint."
        )
        
    # Sort by cost (ascending) and then latency (ascending) to mock the optimization solver
    valid_nodes.sort(key=lambda x: (x.cost_usd, x.latency_ms))
    
    selected_nodes = valid_nodes[:3] # Route through top 3 optimal nodes
    route_ids = [n.id for n in selected_nodes]
    total_cost = sum(n.cost_usd for n in selected_nodes)
    avg_latency = sum(n.latency_ms for n in selected_nodes) / len(selected_nodes)
    
    return OptimizationResponse(
        optimal_route=route_ids,
        total_cost_usd=round(total_cost, 4),
        estimated_latency_ms=round(avg_latency, 2),
        status="Optimal routing solved."
    )

@app.post("/api/v1/scrape-intelligence", response_model=ScrapeResult)
def scrape_intelligence(req: ScraperRequest):
    """
    Performs data mining on competitor positioning or market metrics.
    """
    if not req.target_url.startswith("http"):
        raise HTTPException(status_code=400, detail="Invalid target URL schema.")
        
    # Mocking visual/HTML parser logic
    return ScrapeResult(
        title="Global Connectivity Hub",
        headings=["Pricing Plans", "Security Audits", "Partner Operators"],
        detected_features=["Dynamic eSIM allocation", "Zero-trust endpoints", "Dedicated proxy lines"],
        estimated_traffic_score=85.5
    )
