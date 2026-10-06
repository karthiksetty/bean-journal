// Convert DB row (snake_case) to app bean (camelCase)
export const dbToBean = (row) => ({
  id: row.id,
  name: row.name,
  brand: row.brand || "",
  producer: row.producer || "",
  region: row.region || [],
  variety: row.variety || [],
  process: row.process || "",
  bean: row.bean || "Arabica",
  aroma: row.aroma || [],
  myRating: row.my_rating || 0,
  notes: row.notes || "",
  website: row.website || "",
  available: row.available !== false,
});

// Convert app bean to DB row
export const beanToDb = (bean) => ({
  name: bean.name,
  brand: bean.brand,
  producer: bean.producer,
  region: bean.region,
  variety: bean.variety,
  process: bean.process,
  bean: bean.bean,
  aroma: bean.aroma,
  my_rating: bean.myRating,
  notes: bean.notes,
  website: bean.website || null,
  available: bean.available !== false,
});
