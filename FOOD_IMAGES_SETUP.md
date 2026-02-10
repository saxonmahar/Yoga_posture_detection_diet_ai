# Food Images Setup Guide

## Where to Place Your Nepali Food Images

### Directory Structure
Create this folder structure in your project:

```
frontend/public/images/food/
├── breakfast/
│   ├── dal-bhat.jpg
│   ├── chiura.jpg
│   ├── sel-roti.jpg
│   ├── paratha.jpg
│   └── upma.jpg
├── lunch/
│   ├── dal-bhat-tarkari.jpg
│   ├── momo.jpg
│   ├── thukpa.jpg
│   ├── rajma-chawal.jpg
│   └── chole-bhature.jpg
├── dinner/
│   ├── khichdi.jpg
│   ├── roti-sabzi.jpg
│   ├── soup.jpg
│   ├── grilled-paneer.jpg
│   └── light-dal.jpg
└── snacks/
    ├── fruits.jpg
    ├── nuts.jpg
    ├── yogurt.jpg
    └── smoothie.jpg
```

### Image Requirements
- **Format**: JPG or PNG
- **Size**: 800x600px (or similar 4:3 ratio)
- **File size**: Under 500KB each
- **Naming**: Use lowercase with hyphens (e.g., `dal-bhat.jpg`)

### How to Add Images

1. **Create the folders**:
   ```bash
   cd frontend/public/images
   mkdir food
   cd food
   mkdir breakfast lunch dinner snacks
   ```

2. **Copy your images** into the appropriate folders

3. **Verify images** are accessible at:
   - `http://localhost:3002/images/food/breakfast/dal-bhat.jpg`
   - `http://localhost:3002/images/food/lunch/momo.jpg`
   - etc.

### Image Naming Convention

Match these names with your actual food items:

**Breakfast**:
- `dal-bhat.jpg` - Dal with rice
- `chiura.jpg` - Beaten rice
- `sel-roti.jpg` - Sweet rice bread
- `paratha.jpg` - Flatbread
- `upma.jpg` - Semolina dish
- `poha.jpg` - Flattened rice

**Lunch**:
- `dal-bhat-tarkari.jpg` - Complete meal
- `momo.jpg` - Dumplings
- `thukpa.jpg` - Noodle soup
- `rajma-chawal.jpg` - Kidney beans with rice
- `chole-bhature.jpg` - Chickpeas with bread
- `biryani.jpg` - Spiced rice

**Dinner**:
- `khichdi.jpg` - Rice and lentils
- `roti-sabzi.jpg` - Bread with vegetables
- `soup.jpg` - Vegetable soup
- `grilled-paneer.jpg` - Grilled cottage cheese
- `light-dal.jpg` - Light lentil soup

**Snacks/Recovery**:
- `banana-peanut-butter.jpg`
- `greek-yogurt-fruits.jpg`
- `mixed-nuts.jpg`
- `protein-smoothie.jpg`
- `coconut-water.jpg`

### Next Steps

Once you've placed the images:
1. Run the implementation script I'll provide
2. The system will automatically use your real images
3. Fallback to placeholder if image not found

---

**Status**: Ready for implementation
**Date**: February 10, 2026
