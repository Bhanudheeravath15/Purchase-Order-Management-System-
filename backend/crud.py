from sqlalchemy.orm import Session
import models, schemas
import uuid

def get_vendors(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Vendor).offset(skip).limit(limit).all()

def create_vendor(db: Session, vendor: schemas.VendorCreate):
    db_vendor = models.Vendor(**vendor.dict())
    db.add(db_vendor)
    db.commit()
    db.refresh(db_vendor)
    return db_vendor

def get_products(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Product).offset(skip).limit(limit).all()

def create_product(db: Session, product: schemas.ProductCreate):
    db_product = models.Product(**product.dict())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

def calculate_total(items, db: Session):
    """Business Logic: Calculate Total with automatic 5% tax applied."""
    total = 0.0
    db_items = []
    for item in items:
        prod = db.query(models.Product).filter(models.Product.id == item.product_id).first()
        if prod:
            price = prod.unit_price
            total += price * item.quantity
            db_item = models.PurchaseOrderItem(
                product_id=item.product_id,
                quantity=item.quantity,
                price_at_purchase=price
            )
            db_items.append(db_item)
            
    # automatically applies a 5% tax
    total_with_tax = total * 1.05
    return total_with_tax, db_items

def create_purchase_order(db: Session, po: schemas.POCreate):
    ref_no = "PO-" + str(uuid.uuid4())[:8].upper()
    
    total_with_tax, db_items = calculate_total(po.items, db)
    
    db_po = models.PurchaseOrder(
        reference_no=ref_no,
        vendor_id=po.vendor_id,
        total_amount=total_with_tax,
        items=db_items
    )
    db.add(db_po)
    db.commit()
    db.refresh(db_po)
    return db_po

def get_purchase_orders(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.PurchaseOrder).offset(skip).limit(limit).all()

def get_purchase_order(db: Session, po_id: int):
    return db.query(models.PurchaseOrder).filter(models.PurchaseOrder.id == po_id).first()

def update_po_status(db: Session, po_id: int, status: str):
    db_po = db.query(models.PurchaseOrder).filter(models.PurchaseOrder.id == po_id).first()
    if db_po:
        db_po.status = status
        db.commit()
        db.refresh(db_po)
    return db_po

def delete_purchase_order_by_ref(db: Session, ref_no: str):
    db_po = db.query(models.PurchaseOrder).filter(models.PurchaseOrder.reference_no == ref_no).first()
    if db_po:
        db.delete(db_po)
        db.commit()
        return True
    return False

