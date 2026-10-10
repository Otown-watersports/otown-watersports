"use client";

export default function PrintButton() {
  return <button type="button" className="btn btn--outline-light btn--pill" onClick={() => window.print()}>Print</button>;
}
