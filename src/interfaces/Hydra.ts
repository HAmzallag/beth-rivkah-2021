export interface HydraCollection<T> {
  "@context": string,
  "@id": string,
  "@type": string,
  "hydra:member": T[],
  "hydra:totalItems": number,
  "hydra:view"?: {
    "@id": string,
    "@type": string,
    "hydra:first": string,
    "hydra:last": string,
    "hydra:next": string
  }
}