// plotly.js-basic-dist is Plotly's small build (lines, bars, and pies) and doesn't come with
// TypeScript types. It has the same functions as the full plotly.js, so reuse those types.
declare module "plotly.js-basic-dist" {
  import * as Plotly from "plotly.js";
  export default Plotly;
}
