from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from decimal import Decimal

class VendorBase(BaseModel):
    name: str
    contact: str
    rating: float

class VendorCreate(VendorBase):
    pass

class VendorOut(VendorBase):
    id: int
    class Config:
        from_attributes = True

class ProductBase(BaseModel):
    name: str
    sku: str
    unit_price: Decimal
    stock_level: int

class ProductCreate(ProductBase):
    pass

class ProductOut(ProductBase):
    id: int
    class Config:
        from_attributes = True

class POItemCreate(BaseModel):
    product_id: int
    quantity: int

class POCreate(BaseModel):
    vendor_id: int
    items: List[POItemCreate]

class POItemOut(BaseModel):
    id: int
    product_id: int
    quantity: int
    price_at_purchase: Decimal
    product: ProductOut
    class Config:
        from_attributes = True

class POOut(BaseModel):
    id: int
    reference_no: str
    vendor_id: int
    total_amount: Decimal
    status: str
    created_at: datetime
    vendor: VendorOut
    items: List[POItemOut]
    class Config:
        from_attributes = True

class POStatusUpdate(BaseModel):
    status: str

