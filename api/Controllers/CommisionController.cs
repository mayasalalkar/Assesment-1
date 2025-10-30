using Microsoft.AspNetCore.Mvc;

namespace AvalphaTechnologies.CommissionCalculator.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class CommissionController : ControllerBase
    {
        [HttpPost]
        public IActionResult Calculate([FromBody] CommissionRequest request)
        {
            if (request == null)
                return BadRequest("Request body is missing.");
            if (request.LocalSalesCount < 0 || request.ForeignSalesCount < 0 || request.AverageSaleAmount < 0)
                return BadRequest("Values must be greater than or equal to zero.");
            if (request.LocalSalesCount > 100000 || request.ForeignSalesCount > 100000)
                return BadRequest("Sales counts too large.");

            const decimal AvalphaLocalRate = 0.20m;
            const decimal AvalphaForeignRate = 0.35m;
            const decimal CompetitorLocalRate = 0.02m;
            const decimal CompetitorForeignRate = 0.0755m;

            var avalphaLocal = AvalphaLocalRate * request.LocalSalesCount * request.AverageSaleAmount;
            var avalphaForeign = AvalphaForeignRate * request.ForeignSalesCount * request.AverageSaleAmount;
            var avalphaTotal = avalphaLocal + avalphaForeign;

            var competitorLocal = CompetitorLocalRate * request.LocalSalesCount * request.AverageSaleAmount;
            var competitorForeign = CompetitorForeignRate * request.ForeignSalesCount * request.AverageSaleAmount;
            var competitorTotal = competitorLocal + competitorForeign;

            var response = new CommissionResponse
            {
                AvalphaLocal = decimal.Round(avalphaLocal, 2),
                AvalphaForeign = decimal.Round(avalphaForeign, 2),
                AvalphaTotal = decimal.Round(avalphaTotal, 2),
                CompetitorLocal = decimal.Round(competitorLocal, 2),
                CompetitorForeign = decimal.Round(competitorForeign, 2),
                CompetitorTotal = decimal.Round(competitorTotal, 2)
            };

            return Ok(response);
        }
    }

    // Simple model classes in same file for clarity
    public class CommissionRequest
    {
        public int LocalSalesCount { get; set; }
        public int ForeignSalesCount { get; set; }
        public decimal AverageSaleAmount { get; set; }
    }

    public class CommissionResponse
    {
        public decimal AvalphaLocal { get; set; }
        public decimal AvalphaForeign { get; set; }
        public decimal AvalphaTotal { get; set; }
        public decimal CompetitorLocal { get; set; }
        public decimal CompetitorForeign { get; set; }
        public decimal CompetitorTotal { get; set; }
    }
}
