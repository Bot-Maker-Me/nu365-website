-- Product catalog seed (33 products).
-- Safe to run more than once: existing products (matched by slug) are updated, not duplicated.
-- Product images are served by the website itself from /public/products/<slug>.webp.

insert into public.products (name, slug, description, price, quantity, in_stock, image_url, category)
values
  ('5-AMINO-1MQ 5MG', '5-amino-1mq-5mg', 'High-quality 5-AMINO-1MQ 5MG for research purposes only.', 60, 10, true, '/products/5-amino-1mq-5mg.webp', 'Research Compounds'),
  ('AICAR 50MG', 'aicar-50mg', 'High-quality AICAR 50MG for research purposes only.', 90, 10, true, '/products/aicar-50mg.webp', 'Research Compounds'),
  ('BPC-157 10MG', 'bpc-157-10mg', 'High-quality BPC-157 10MG for research purposes only.', 50, 10, true, '/products/bpc-157-10mg.webp', 'Research Compounds'),
  ('CJC-1295 10MG', 'cjc-1295-10mg', 'High-quality CJC-1295 10MG for research purposes only.', 50, 10, true, '/products/cjc-1295-10mg.webp', 'Research Compounds'),
  ('CJC-1295 WITH DAC 5MG', 'cjc-1295-with-dac-5mg', 'High-quality CJC-1295 WITH DAC 5MG for research purposes only.', 60, 10, true, '/products/cjc-1295-with-dac-5mg.webp', 'Research Compounds'),
  ('CJC WITHOUT DAC IPAMORELIN 10MG', 'cjc-without-dac-ipamorelin-10mg', 'High-quality CJC WITHOUT DAC IPAMORELIN 10MG for research purposes only.', 50, 10, true, '/products/cjc-without-dac-ipamorelin-10mg.webp', 'Research Compounds'),
  ('EPITALON 50MG', 'epitalon-50mg', 'High-quality EPITALON 50MG for research purposes only.', 90, 10, true, '/products/epitalon-50mg.webp', 'Research Compounds'),
  ('GHK-Cu 100MG', 'ghk-cu-100mg', 'High-quality GHK-Cu 100MG for research purposes only.', 120, 10, true, '/products/ghk-cu-100mg.webp', 'Research Compounds'),
  ('GLOW BLEND BPC GHK TB 70MG', 'glow-blend-bpc-ghk-tb-70mg', 'High-quality GLOW BLEND BPC GHK TB 70MG for research purposes only.', 90, 10, true, '/products/glow-blend-bpc-ghk-tb-70mg.webp', 'Research Compounds'),
  ('GLUTATHIONE 1500', 'glutathione-1500', 'High-quality GLUTATHIONE 1500 for research purposes only.', 150, 10, true, '/products/glutathione-1500.webp', 'Research Compounds'),
  ('HCG 10000IU', 'hcg-10000iu', 'High-quality HCG 10000IU for research purposes only.', 150, 10, true, '/products/hcg-10000iu.webp', 'Research Compounds'),
  ('HEALING BLEND BPC-157 TB-500 20MG', 'healing-blend-bpc-157-tb-500-20mg', 'High-quality HEALING BLEND BPC-157 TB-500 20MG for research purposes only.', 70, 10, true, '/products/healing-blend-bpc-157-tb-500-20mg.webp', 'Research Compounds'),
  ('HEXARELIN ACETATE 5MG', 'hexarelin-acetate-5mg', 'High-quality HEXARELIN ACETATE 5MG for research purposes only.', 60, 10, true, '/products/hexarelin-acetate-5mg.webp', 'Research Compounds'),
  ('IGF-1LR3 1MG', 'igf-1lr3-1mg', 'High-quality IGF-1LR3 1MG for research purposes only.', 80, 10, true, '/products/igf-1lr3-1mg.webp', 'Research Compounds'),
  ('IPAMORELIN 10MG', 'ipamorelin-10mg', 'High-quality IPAMORELIN 10MG for research purposes only.', 50, 10, true, '/products/ipamorelin-10mg.webp', 'Research Compounds'),
  ('KISSPEPTIN 10MG', 'kisspeptin-10mg', 'High-quality KISSPEPTIN 10MG for research purposes only.', 50, 10, true, '/products/kisspeptin-10mg.webp', 'Research Compounds'),
  ('KLOW BLEND BPC TB GHK KPV 80MG', 'klow-blend-bpc-tb-ghk-kpv-80mg', 'High-quality KLOW BLEND BPC TB GHK KPV 80MG for research purposes only.', 90, 10, true, '/products/klow-blend-bpc-tb-ghk-kpv-80mg.webp', 'Research Compounds'),
  ('KPV 10MG', 'kpv-10mg', 'High-quality KPV 10MG for research purposes only.', 50, 10, true, '/products/kpv-10mg.webp', 'Research Compounds'),
  ('MELANOTAN-2 10MG', 'melanotan-2-10mg', 'High-quality MELANOTAN-2 10MG for research purposes only.', 50, 10, true, '/products/melanotan-2-10mg.webp', 'Research Compounds'),
  ('MGF 2MG', 'mgf-2mg', 'High-quality MGF 2MG for research purposes only.', 80, 10, true, '/products/mgf-2mg.webp', 'Research Compounds'),
  ('MOTS-C 40MG', 'mots-c-40mg', 'High-quality MOTS-C 40MG for research purposes only.', 70, 10, true, '/products/mots-c-40mg.webp', 'Research Compounds'),
  ('PEG-MGF 2MG', 'peg-mgf-2mg', 'High-quality PEG-MGF 2MG for research purposes only.', 80, 10, true, '/products/peg-mgf-2mg.webp', 'Research Compounds'),
  ('PINEALON 20MG', 'pinealon-20mg', 'High-quality PINEALON 20MG for research purposes only.', 70, 10, true, '/products/pinealon-20mg.webp', 'Research Compounds'),
  ('PT-141 10MG', 'pt-141-10mg', 'High-quality PT-141 10MG for research purposes only.', 50, 10, true, '/products/pt-141-10mg.webp', 'Research Compounds'),
  ('RETATRUTIDE 20MG', 'retatrutide-20mg', 'High-quality RETATRUTIDE 20MG for research purposes only.', 70, 10, true, '/products/retatrutide-20mg.webp', 'Research Compounds'),
  ('SELANK 11MG', 'selank-11mg', 'High-quality SELANK 11MG for research purposes only.', 50, 10, true, '/products/selank-11mg.webp', 'Research Compounds'),
  ('SEMAX 11MG', 'semax-11mg', 'High-quality SEMAX 11MG for research purposes only.', 50, 10, true, '/products/semax-11mg.webp', 'Research Compounds'),
  ('SERMORELIN 5MG', 'sermorelin-5mg', 'High-quality SERMORELIN 5MG for research purposes only.', 60, 10, true, '/products/sermorelin-5mg.webp', 'Research Compounds'),
  ('SLU-PP-322 Research Only', 'slu-pp-322-research-only', 'High-quality SLU-PP-322 for research purposes only.', 75, 10, true, '/products/slu-pp-322-research-only.webp', 'Research Compounds'),
  ('SS-31 50MG', 'ss-31-50mg', 'High-quality SS-31 50MG for research purposes only.', 90, 10, true, '/products/ss-31-50mg.webp', 'Research Compounds'),
  ('TB-500 10MG', 'tb-500-10mg', 'High-quality TB-500 10MG for research purposes only.', 50, 10, true, '/products/tb-500-10mg.webp', 'Research Compounds'),
  ('TESAMORELIN 10MG', 'tesamorelin-10mg', 'High-quality TESAMORELIN 10MG for research purposes only.', 50, 10, true, '/products/tesamorelin-10mg.webp', 'Research Compounds'),
  ('THYMOSIN ALPHA-1 10MG', 'thymosin-alpha-1-10mg', 'High-quality THYMOSIN ALPHA-1 10MG for research purposes only.', 50, 10, true, '/products/thymosin-alpha-1-10mg.webp', 'Research Compounds')
on conflict (slug) do update set
  name        = excluded.name,
  description = excluded.description,
  price       = excluded.price,
  quantity    = excluded.quantity,
  in_stock    = excluded.in_stock,
  image_url   = excluded.image_url,
  category    = excluded.category;
