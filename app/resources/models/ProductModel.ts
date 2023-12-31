import { model } from "mongoose"
import ModelsNames from "@/helpers/models/name"
import ProductSchema from "@/utils/schema/ProductSchema"
import ProductI from "@/utils/interfaces/productInterface"


export const ProductModel = model<ProductI>(ModelsNames.product, ProductSchema)