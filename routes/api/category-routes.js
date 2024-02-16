const router = require('express').Router();
const { Category, Product } = require('../../models');

router.get('/', async (req, res) => {
  try {
    const categories = await Category.findAll({
      include: [{model: Product}],
    });
    res.json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({error: 'Server Error'})
  }
});

router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id, {
      include: [{ model: Product }],
    });
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.json(category);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', async (req, res) => {
  try {
    const newCategory = await Category.create(req.body);
    res.status(201).json(newCategory);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' }); 
  }
});

router.put('/:id', async (req, res) => {
  try {
    const [updatedRowsCount, updatedCategory] = await Category.update(req.body, {
      where: { id: req.params.id },
      returning: true, // include the updated record in the result
    });
    if (updatedRowsCount === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.json(updatedCategory[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deletedRowCount = await Category.destroy({
      where: { id: req.params.id },
    });
    if (deletedRowCount === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.status(204).end(); // 204 No Content
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;