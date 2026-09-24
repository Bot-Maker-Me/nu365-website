-- Delete old placeholder products and insert new vial label products
-- Run this in your Supabase SQL Editor

-- First, delete all existing products
DELETE FROM products;

-- Then insert all 32 new products from vial labels
INSERT INTO products (name, slug, description, price, quantity, in_stock, image_url, category) VALUES
('5-AMINO-1MQ 5MG', '5-amino-1mq-5mg', 'High-quality 5-AMINO-1MQ 5MG for research purposes only.', 50, 10, true, '/products/5-AMINO-1MQ_5MG_matte-silver-reflection.png', 'Research Compounds'),
('AICAR 50MG', 'aicar-50mg', 'High-quality AICAR 50MG for research purposes only.', 90, 10, true, '/products/AICAR_50MG_matte-silver-reflection.png', 'Research Compounds'),
('BPC-157 10MG', 'bpc-157-10mg', 'High-quality BPC-157 10MG for research purposes only.', 50, 10, true, '/products/BPC-157_10MG_matte-silver-reflection.png', 'Research Compounds'),
('CJC-1295 10MG', 'cjc-1295-10mg', 'High-quality CJC-1295 10MG for research purposes only.', 50, 10, true, '/products/CJC-1295_10MG_matte-silver-reflection.png', 'Research Compounds'),
('CJC-1295 WITH DAC 5MG', 'cjc-1295-with-dac-5mg', 'High-quality CJC-1295 WITH DAC 5MG for research purposes only.', 60, 10, true, '/products/CJC-1295_WITH_DAC_5MG_matte-silver-reflection.png', 'Research Compounds'),
('CJC WITHOUT DAC IPAMORELIN 10MG', 'cjc-without-dac-ipamorelin-10mg', 'High-quality CJC WITHOUT DAC IPAMORELIN 10MG for research purposes only.', 50, 10, true, '/products/CJC_WITHOUT_DAC_IPAMORELIN_10MG_matte-silver-reflection.png', 'Research Compounds'),
('EPITALON 50MG', 'epitalon-50mg', 'High-quality EPITALON 50MG for research purposes only.', 90, 10, true, '/products/EPITALON_50MG_matte-silver-reflection.png', 'Research Compounds'),
('GHK-Cu 100MG', 'ghk-cu-100mg', 'High-quality GHK-Cu 100MG for research purposes only.', 120, 10, true, '/products/GHK-Cu_100MG_v4_matte-silver-reflection.png', 'Research Compounds'),
('GLOW BLEND BPC GHK TB 70MG', 'glow-blend-bpc-ghk-tb-70mg', 'High-quality GLOW BLEND BPC GHK TB 70MG for research purposes only.', 70, 10, true, '/products/GLOW_BLEND_BPC_GHK_TB_70MG_matte-silver-reflection.png', 'Research Compounds'),
('GLUTATHIONE 1500', 'glutathione-1500', 'High-quality GLUTATHIONE 1500 for research purposes only.', 150, 10, true, '/products/GLUTATHIONE_1500_matte-silver-reflection.png', 'Research Compounds'),
('HCG 10000IU', 'hcg-10000iu', 'High-quality HCG 10000IU for research purposes only.', 150, 10, true, '/products/HCG_10000IU_matte-silver-reflection.png', 'Research Compounds'),
('HEALING BLEND BPC-157 TB-500 20MG', 'healing-blend-bpc-157-tb-500-20mg', 'High-quality HEALING BLEND BPC-157 TB-500 20MG for research purposes only.', 70, 10, true, '/products/HEALING_BLEND_BPC-157_TB-500_20MG_matte-silver-reflection.png', 'Research Compounds'),
('HEXARELIN ACETATE 5MG', 'hexarelin-acetate-5mg', 'High-quality HEXARELIN ACETATE 5MG for research purposes only.', 60, 10, true, '/products/HEXARELIN_ACETATE_5MG_matte-silver-reflection.png', 'Research Compounds'),
('IGF-1LR3 1MG', 'igf-1lr3-1mg', 'High-quality IGF-1LR3 1MG for research purposes only.', 80, 10, true, '/products/IGF-1LR3_1MG_matte-silver-reflection.png', 'Research Compounds'),
('IPAMORELIN 10MG', 'ipamorelin-10mg', 'High-quality IPAMORELIN 10MG for research purposes only.', 50, 10, true, '/products/IPAMORELIN_10MG_matte-silver-reflection.png', 'Research Compounds'),
('KISSPEPTIN 10MG', 'kisspeptin-10mg', 'High-quality KISSPEPTIN 10MG for research purposes only.', 50, 10, true, '/products/KISSPEPTIN_10MG_matte-silver-reflection.png', 'Research Compounds'),
('KLOW BLEND BPC TB GHK KPV 80MG', 'klow-blend-bpc-tb-ghk-kpv-80mg', 'High-quality KLOW BLEND BPC TB GHK KPV 80MG for research purposes only.', 90, 10, true, '/products/KLOW_BLEND_BPC_TB_GHK_KPV_80MG_matte-silver-reflection.png', 'Research Compounds'),
('KPV 10MG', 'kpv-10mg', 'High-quality KPV 10MG for research purposes only.', 50, 10, true, '/products/KPV_10MG_matte-silver-reflection.png', 'Research Compounds'),
('MELANOTAN-2 10MG', 'melanotan-2-10mg', 'High-quality MELANOTAN-2 10MG for research purposes only.', 50, 10, true, '/products/MELANOTAN-2_10MG_matte-silver-reflection.png', 'Research Compounds'),
('MGF 2MG', 'mgf-2mg', 'High-quality MGF 2MG for research purposes only.', 80, 10, true, '/products/MGF_2MG_matte-silver-reflection.png', 'Research Compounds'),
('MOTS-C 40MG', 'mots-c-40mg', 'High-quality MOTS-C 40MG for research purposes only.', 90, 10, true, '/products/MOTS-C_40MG_matte-silver-reflection.png', 'Research Compounds'),
('PEG-MGF 2MG', 'peg-mgf-2mg', 'High-quality PEG-MGF 2MG for research purposes only.', 80, 10, true, '/products/PEG-MGF_2MG_matte-silver-reflection.png', 'Research Compounds'),
('PINEALON 20MG', 'pinealon-20mg', 'High-quality PINEALON 20MG for research purposes only.', 70, 10, true, '/products/PINEALON_20MG_matte-silver-reflection.png', 'Research Compounds'),
('PT-141 10MG', 'pt-141-10mg', 'High-quality PT-141 10MG for research purposes only.', 50, 10, true, '/products/PT-141_10MG_matte-silver-reflection.png', 'Research Compounds'),
('RETATRUTIDE 20MG', 'retatrutide-20mg', 'High-quality RETATRUTIDE 20MG for research purposes only.', 70, 10, true, '/products/RETATRUTIDE_20MG_matte-silver-reflection.png', 'Research Compounds'),
('SELANK 11MG', 'selank-11mg', 'High-quality SELANK 11MG for research purposes only.', 50, 10, true, '/products/SELANK_11MG_matte-silver-reflection.png', 'Research Compounds'),
('SEMAX 11MG', 'semax-11mg', 'High-quality SEMAX 11MG for research purposes only.', 50, 10, true, '/products/SEMAX_11MG_matte-silver-reflection.png', 'Research Compounds'),
('SERMORELIN 5MG', 'sermorelin-5mg', 'High-quality SERMORELIN 5MG for research purposes only.', 60, 10, true, '/products/SERMORELIN_5MG_matte-silver-reflection.png', 'Research Compounds'),
('SS-31 50MG', 'ss-31-50mg', 'High-quality SS-31 50MG for research purposes only.', 90, 10, true, '/products/SS-31_50MG_matte-silver-reflection.png', 'Research Compounds'),
('TB-500 10MG', 'tb-500-10mg', 'High-quality TB-500 10MG for research purposes only.', 50, 10, true, '/products/TB-500_10MG_matte-silver-reflection.png', 'Research Compounds'),
('TESAMORELIN 10MG', 'tesamorelin-10mg', 'High-quality TESAMORELIN 10MG for research purposes only.', 50, 10, true, '/products/TESAMORELIN_10MG_matte-silver-reflection.png', 'Research Compounds'),
('THYMOSIN ALPHA-1 10MG', 'thymosin-alpha-1-10mg', 'High-quality THYMOSIN ALPHA-1 10MG for research purposes only.', 50, 10, true, '/products/THYMOSIN_ALPHA-1_10MG_matte-silver-reflection.png', 'Research Compounds');