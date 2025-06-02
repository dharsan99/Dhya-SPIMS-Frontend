export function injectInlineTableStyles(html: string): string {
    return html
      .replace(/<table/g, `<table border="1" cellpadding="8" cellspacing="0" style="border-collapse: collapse; width: 100%; font-family: Arial, sans-serif; font-size: 14px;"`)
      .replace(/<th/g, `<th style="background-color: #f2f2f2; text-align: left;"`)
      .replace(/<td/g, `<td style="text-align: left;"`);
  }