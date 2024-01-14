export interface IDrug {
  id: number
  atc?: string
  name: string
  producer?: string
  importer?: string
  packaging?: string
  prescription?: string
  isPsycholeptic: boolean
}