# Product Identity and Supplied Images

Confirmed by the user for this presentation website.

| Product | Appearance | API project | Local image |
| --- | --- | --- | --- |
| Cellit | Black device | First/original project: ihht-api-simulator | public/assets/products/cellit.jpg |
| CellAirOne | White medical device | Second project: ihht-api-simulator-CellAirOne | public/assets/products/cellairone.jpg |

Use Cellit and CellAirOne as the customer-facing product names. Internal contract or legacy project terminology must not cause the product images or protocol descriptions to be swapped.

## API association

- Cellit: original IHHT therapy settings, live therapy values, and complete therapy data.
- CellAirOne: second API project, supporting Therapy, Hyperoxia, HT1, HT2, HRV, and BOLT with activity-specific messages and results.

The description of CellAirOne as a medical device is supplied by the user. It does not establish a regulatory class, certification, clinical indication, or safety claim. Do not infer those details from the images.

## Image provenance

The local JPEGs are unmodified copies of the two user-supplied product photographs. Their original names identify TUR copyright/all-rights-reserved information. Preserve TUR branding, copyright information, and the actual appearance of both devices.

- cellit.jpg: source file begins cellit_Version_black_black and ends All rights reserved.jpg.
- cellairone.jpg: source file begins cellairone_software_ and contains the TUR copyright identifier.

No stock images, generated replacements, recoloring, background removal, or cropping have been applied.

## Use in the presentation

- Use the black Cellit image only for Cellit.
- Use the white CellAirOne image only for CellAirOne.
- Keep the complete device visible and preserve the source aspect ratio.
- Use descriptive alternative text: "Black Cellit device" and "White CellAirOne medical device".
- Use relative local asset paths so the site works offline and on Cloudflare Pages.
- The supplied originals are high resolution. Prepare appropriately compressed/responsive display assets during website implementation while preserving the products and branding.
- Product photos represent real products. Demonstration measurements and communication animations must still be labeled as illustrative, not live.
