create or replace function public.create_test_order(
  p_customer jsonb,
  p_items jsonb,
  p_subtotal numeric,
  p_product_discount numeric default 0,
  p_coupon_code text default null,
  p_coupon_discount numeric default 0,
  p_delivery_charge numeric default 0,
  p_total numeric default 0
)
returns table(order_id uuid, order_number text)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_customer_id uuid;
  v_order_id uuid;
  v_order_number text;
  v_item jsonb;
  v_product_id uuid;
  v_qty int;
begin
  if p_total < 0 or p_subtotal < 0 then raise exception 'Invalid order total'; end if;
  if jsonb_array_length(coalesce(p_items,'[]'::jsonb)) = 0 then raise exception 'Cart is empty'; end if;

  insert into public.customers(user_id,name,email,phone,address,city,pin)
  values(auth.uid(),coalesce(p_customer->>'name',''),p_customer->>'email',p_customer->>'phone',coalesce(p_customer->>'address',''),coalesce(p_customer->>'city',''),coalesce(p_customer->>'pin',''))
  returning id into v_customer_id;

  v_order_number := 'PG-' || to_char(now(),'YYYYMMDD') || '-' || upper(substr(replace(gen_random_uuid()::text,'-',''),1,6));
  insert into public.orders(order_number,customer_id,user_id,customer_name,customer_phone,address,city,pin,subtotal,product_discount,coupon_code,coupon_discount,delivery_charge,total,payment_method,payment_status,status)
  values(v_order_number,v_customer_id,auth.uid(),coalesce(p_customer->>'name',''),coalesce(p_customer->>'phone',''),coalesce(p_customer->>'address',''),coalesce(p_customer->>'city',''),coalesce(p_customer->>'pin',''),p_subtotal,p_product_discount,p_coupon_code,p_coupon_discount,p_delivery_charge,p_total,'test','paid','new')
  returning id into v_order_id;

  for v_item in select * from jsonb_array_elements(p_items)
  loop
    v_product_id := null;
    begin v_product_id := nullif(v_item->>'id','')::uuid; exception when others then v_product_id := null; end;
    v_qty := greatest(1,coalesce((v_item->>'qty')::int,1));
    insert into public.order_items(order_id,product_id,product_code,product_name,sku,color,size,quantity,unit_price,line_total)
    values(v_order_id,v_product_id,coalesce(v_item->>'code',''),coalesce(v_item->>'name','Product'),v_item->>'sku',v_item->>'color',v_item->>'size',v_qty,coalesce((v_item->>'price')::numeric,0),coalesce((v_item->>'price')::numeric,0)*v_qty);
    if v_product_id is not null then
      update public.products set stock=greatest(0,stock-v_qty),updated_at=now() where id=v_product_id;
    end if;
  end loop;

  return query select v_order_id,v_order_number;
end;
$$;

grant execute on function public.create_test_order(jsonb,jsonb,numeric,numeric,text,numeric,numeric,numeric) to anon, authenticated;
