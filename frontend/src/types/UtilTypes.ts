export interface Erc721Attribute {
    trait_type: string
    value: string
}
interface default_name_type {
    type: string
    description: string
}

export interface Erc721Properties {
    name: default_name_type
    created_at: default_name_type
    preview_media_file_type?: default_name_type
    totalSupply?:default_name_type
    total_supply?:default_name_type
}

export interface Paged<T> {
    page: number
    per_page: number
    pre_page: number
    next_page: number
    total: number
    total_pages:number
    data:T
}
