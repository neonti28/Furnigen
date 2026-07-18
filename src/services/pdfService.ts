import type { DesignData } from '@/types';

/** Converts a Bill of Materials (BOM) string into HTML table rows. */
const parseBomToHtmlTableRows = (bom: string): string => {
  if (!bom)
    return '<tr><td colspan="2" class="p-3 text-slate-500">Data not available.</td></tr>';

  return bom
    .split('\n')
    .filter((line) => line.trim() !== '')
    .map((line) => {
      const cleanedLine = line.trim().replace(/^-/, '').trim();
      const parts = cleanedLine.split(':');
      const component = parts[0]?.trim() || '';
      const material = parts.slice(1).join(':').trim() || 'N/A';
      return `
        <tr class="hover:bg-slate-50">
          <td class="p-3 text-slate-600 border-b border-slate-200 w-1/3">${component}</td>
          <td class="p-3 text-slate-600 border-b border-slate-200">${material}</td>
        </tr>
      `;
    })
    .join('');
};

/** Converts a string of manufacturing/finishing steps into HTML list items. */
const parseTextToHtmlList = (text: string): string => {
  if (!text) return '<li>Data not available.</li>';

  return text
    .split('\n')
    .filter((line) => line.trim() !== '')
    .map((line) => {
      const cleanedLine = line.trim().replace(/^\d+\.\s*|-\s*/, '');
      return `<li class="leading-relaxed mb-2">${cleanedLine}</li>`;
    })
    .join('');
};

export const generatePdf = (data: DesignData, includeCosts: boolean) => {
  if (!data || !data.id) {
    alert('Design data is unavailable to generate a PDF.');
    return;
  }

  const totalProductionCost =
    data.materialCost + data.manufacturingCost + data.finishingQCCost;
  const profit = data.salePrice - totalProductionCost;
  const margin =
    data.salePrice > 0 ? (profit / data.salePrice) * 100 : 0;

  const costSectionHtml = includeCosts
    ? `
    <!-- Cost Analysis Section -->
    <section class="mt-8 pt-8 border-t border-slate-200 page-break-inside-avoid">
        <h2 class="text-xl font-bold text-slate-800 border-b-2 border-amber-500 pb-2 mb-4 inline-block">Cost & Price Analysis</h2>
        <p class="text-slate-500 text-sm mb-4">These cost estimates are approximate and may vary depending on suppliers and market conditions.</p>

        <div class="bg-slate-50 rounded-lg p-4 border border-slate-200">
            <table class="w-full text-left border-collapse text-sm">
                <tbody>
                    <tr class="hover:bg-slate-100">
                        <td class="p-2 text-slate-600 border-b border-slate-200 w-3/5">Material Cost (BOM)</td>
                        <td class="p-2 text-slate-800 border-b border-slate-200 font-medium text-right">$${data.materialCost.toLocaleString(
                          'en-US'
                        )}</td>
                    </tr>
                    <tr class="hover:bg-slate-100">
                        <td class="p-2 text-slate-600 border-b border-slate-200">Manufacturing & Assembly Cost</td>
                        <td class="p-2 text-slate-800 border-b border-slate-200 font-medium text-right">$${data.manufacturingCost.toLocaleString(
                          'en-US'
                        )}</td>
                    </tr>
                    <tr class="hover:bg-slate-100">
                        <td class="p-2 text-slate-600 border-b-2 border-slate-300">Finishing & Quality Control Cost</td>
                        <td class="p-2 text-slate-800 border-b-2 border-slate-300 font-medium text-right">$${data.finishingQCCost.toLocaleString(
                          'en-US'
                        )}</td>
                    </tr>
                    <tr class="bg-white font-bold">
                        <td class="p-2 text-slate-900 pt-3">Total Estimated Production Cost</td>
                        <td class="p-2 text-amber-600 text-right pt-3 text-lg">$${totalProductionCost.toLocaleString(
                          'en-US'
                        )}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="mt-4 border border-dashed border-slate-300 rounded-lg p-4">
             <table class="w-full text-left border-collapse text-sm">
                <tbody>
                    <tr>
                        <td class="py-1 text-slate-600">Suggested Retail Price</td>
                        <td class="py-1 text-slate-800 font-bold text-right text-base">$${data.salePrice.toLocaleString(
                          'en-US'
                        )}</td>
                    </tr>
                    <tr>
                        <td class="py-1 text-slate-600">Estimated Profit per Unit</td>
                        <td class="py-1 text-green-600 font-medium text-right">$${profit.toLocaleString(
                          'en-US'
                        )}</td>
                    </tr>
                    <tr>
                        <td class="py-1 text-slate-600">Profit Margin Percentage</td>
                        <td class="py-1 text-green-600 font-medium text-right">${margin.toFixed(
                          1
                        )}%</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </section>
  `
    : '';

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Product Catalog - ${data.name}</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
            body { font-family: 'Inter', sans-serif; -webkit-print-color-adjust: exact; }
            @media print {
                .no-print { display: none !important; }
                body { padding: 0; margin: 0; background: white; }
                .page-container { box-shadow: none !important; margin: 0 !important; max-width: 100% !important; border: none !important; }
                .page-break-inside-avoid { page-break-inside: avoid; }
            }
        </style>
    </head>
    <body class="bg-slate-100 p-8 print:p-0">
        <main class="page-container max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden border border-slate-200">
            <!-- Header -->
            <header class="bg-slate-900 text-white p-8">
                <div class="flex justify-between items-start">
                    <div>
                        <h1 class="text-3xl font-bold capitalize mb-2">${data.name}</h1>
                        <p class="text-slate-300 text-sm tracking-wide uppercase">Technical Specification Document</p>
                    </div>
                    <div class="text-right">
                        <div class="text-amber-500 font-bold text-xl tracking-tight">FurniGen</div>
                    </div>
                </div>
            </header>

            <div class="p-8">
                <!-- Content Grid -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <div>
                        <div class="aspect-square w-full rounded-lg overflow-hidden border border-slate-200 shadow-sm mb-6 bg-white relative">
                             <img src="${data.imageUrl}" alt="${
    data.name
  }" class="w-full h-full object-contain p-2">
                        </div>

                        <div class="bg-slate-50 p-5 rounded-lg border border-slate-200">
                            <h3 class="font-bold text-slate-800 mb-4 border-b border-slate-200 pb-2 text-sm uppercase tracking-wider">Core Specifications</h3>
                            <dl class="space-y-3 text-sm">
                                <div class="flex justify-between">
                                    <dt class="text-slate-500">Dimensions (HxWxD)</dt>
                                    <dd class="font-semibold text-slate-900">${
                                      data.dimensions
                                    }</dd>
                                </div>
                                <div class="flex justify-between">
                                    <dt class="text-slate-500">Estimated Weight</dt>
                                    <dd class="font-semibold text-slate-900">${
                                      data.weight
                                    }</dd>
                                </div>
                                <div class="flex justify-between">
                                    <dt class="text-slate-500">Primary Material</dt>
                                    <dd class="font-semibold text-slate-800 text-right w-1/2">${
                                      data.material
                                    }</dd>
                                </div>
                                <div class="flex justify-between">
                                    <dt class="text-slate-500">Design Style</dt>
                                    <dd class="font-semibold text-slate-900">${
                                      data.style
                                    }</dd>
                                </div>
                                <div class="flex justify-between">
                                    <dt class="text-slate-500">Build Time</dt>
                                    <dd class="font-semibold text-slate-900">${
                                      data.buildTime
                                    }</dd>
                                </div>
                            </dl>
                        </div>
                    </div>

                    <div class="space-y-8">
                        <section>
                            <h2 class="text-lg font-bold text-slate-800 mb-3 flex items-center">
                                <span class="w-2 h-8 bg-amber-500 rounded-full mr-3"></span>
                                Product Description
                            </h2>
                            <p class="text-slate-600 leading-relaxed text-sm text-justify">${
                              data.description
                            }</p>
                        </section>

                        <section>
                            <h2 class="text-lg font-bold text-slate-800 mb-3 flex items-center">
                                <span class="w-2 h-8 bg-amber-500 rounded-full mr-3"></span>
                                Bill of Materials (BOM)
                            </h2>
                            <div class="overflow-hidden border border-slate-200 rounded-lg">
                                <table class="min-w-full divide-y divide-slate-200 text-sm">
                                    <thead class="bg-slate-50">
                                        <tr>
                                            <th class="px-3 py-2 text-left text-xs font-medium text-slate-500 uppercase">Component</th>
                                            <th class="px-3 py-2 text-left text-xs font-medium text-slate-500 uppercase">Details</th>
                                        </tr>
                                    </thead>
                                    <tbody class="bg-white divide-y divide-slate-200">
                                        ${parseBomToHtmlTableRows(data.bom)}
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    </div>
                </div>

                <!-- Manufacturing & Finishing -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-slate-200">
                    <section class="page-break-inside-avoid">
                        <h2 class="text-lg font-bold text-slate-800 mb-3 flex items-center">
                            <span class="w-2 h-8 bg-amber-500 rounded-full mr-3"></span>
                            Manufacturing Guide
                        </h2>
                        <div class="bg-white p-5 rounded-lg border border-slate-200">
                            <ol class="list-decimal list-inside space-y-3 text-sm text-slate-700 marker:font-bold marker:text-amber-600">
                                ${parseTextToHtmlList(data.manufacturing)}
                            </ol>
                        </div>
                    </section>
                     <section class="page-break-inside-avoid">
                        <h2 class="text-lg font-bold text-slate-800 mb-3 flex items-center">
                            <span class="w-2 h-8 bg-amber-500 rounded-full mr-3"></span>
                            Finishing Instructions
                        </h2>
                        <div class="bg-white p-5 rounded-lg border border-slate-200">
                            <ul class="list-disc list-inside space-y-2 text-sm text-slate-700 marker:text-amber-500">
                                ${parseTextToHtmlList(data.finishing)}
                            </ul>
                        </div>
                    </section>
                </div>

                ${costSectionHtml}
            </div>

            <footer class="bg-slate-50 border-t border-slate-200 p-6 text-center text-xs text-slate-500 print:bg-white">
                <p>This document was generated by the FurniGen Studio AI Platform.</p>
                <p class="mt-1">&copy; ${new Date().getFullYear()} FurniGen Studio. All Rights Reserved.</p>
            </footer>
        </main>
        <script>
            // Auto print when loaded
            window.onload = function() {
                setTimeout(function() {
                    window.print();
                }, 800);
            };
        </script>
    </body>
    </html>
  `;

  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);

  const newWindow = window.open(url, '_blank');
  if (!newWindow) {
    alert(
      'Popup blocked! Please allow popups for this site to view the PDF catalog.'
    );
  }
};
