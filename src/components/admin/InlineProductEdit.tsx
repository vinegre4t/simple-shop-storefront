
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Check, X, Edit, Loader2 } from 'lucide-react';
import { Product, useProducts } from '@/context/ProductContext';
import { useAjaxValidation } from '@/hooks/useAjaxValidation';
import { toast } from '@/components/ui/use-toast';

interface InlineProductEditProps {
  product: Product;
}

export default function InlineProductEdit({ product }: InlineProductEditProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: product.name,
    description: product.description,
    price: product.price.toString(),
    category: product.category,
    stock: product.stock.toString(),
    imageUrl: product.imageUrl
  });
  const [isSaving, setIsSaving] = useState(false);
  
  const { updateProduct } = useProducts();
  const { validationState, isValidating, validatePrice, clearValidation } = useAjaxValidation();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (isEditing && formRef.current) {
      const firstInput = formRef.current.querySelector('input') as HTMLInputElement;
      if (firstInput) {
        firstInput.focus();
      }
    }
  }, [isEditing]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      stock: product.stock.toString(),
      imageUrl: product.imageUrl
    });
    setIsEditing(false);
    clearValidation('price');
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      // Валидация цены через AJAX
      const priceValidation = await validatePrice(formData.price);
      if (!priceValidation.isValid) {
        toast({
          title: "Ошибка валидации",
          description: priceValidation.message,
          variant: "destructive",
        });
        setIsSaving(false);
        return;
      }

      // Обновляем товар без перезагрузки страницы
      await updateProduct(product._id, {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        stock: parseInt(formData.stock),
        imageUrl: formData.imageUrl
      });

      setIsEditing(false);
      toast({
        title: "Товар обновлен",
        description: "Изменения сохранены без перезагрузки страницы",
      });
    } catch (error) {
      toast({
        title: "Ошибка сохранения",
        description: "Не удалось сохранить изменения",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePriceChange = async (value: string) => {
    setFormData(prev => ({ ...prev, price: value }));
    if (value) {
      await validatePrice(value);
    } else {
      clearValidation('price');
    }
  };

  if (!isEditing) {
    return (
      <div className="space-y-2 p-4 border rounded-lg">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="font-semibold">{product.name}</h3>
            <p className="text-sm text-muted-foreground">{product.description}</p>
            <div className="flex gap-4 mt-2">
              <span className="font-medium">{product.price} ₽</span>
              <span className="text-sm bg-muted px-2 py-1 rounded">{product.category}</span>
              <span className="text-sm">Склад: {product.stock}</span>
            </div>
          </div>
          <Button size="sm" variant="outline" onClick={handleEdit}>
            <Edit className="h-4 w-4 mr-1" />
            Редактировать
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form ref={formRef} className="space-y-4 p-4 border rounded-lg bg-muted/50">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Название</label>
          <Input
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Название товара"
          />
        </div>
        
        <div>
          <label className="text-sm font-medium">Категория</label>
          <Input
            value={formData.category}
            onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
            placeholder="Категория"
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium">Описание</label>
        <Textarea
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Описание товара"
          rows={2}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="text-sm font-medium">Цена (₽)</label>
          <Input
            type="number"
            value={formData.price}
            onChange={(e) => handlePriceChange(e.target.value)}
            placeholder="0.00"
            step="0.01"
          />
          {isValidating.price && (
            <div className="flex items-center gap-1 mt-1">
              <Loader2 className="h-3 w-3 animate-spin" />
              <span className="text-xs text-muted-foreground">Проверка...</span>
            </div>
          )}
          {validationState.price && (
            <p className={`text-xs mt-1 ${validationState.price.isValid ? 'text-green-600' : 'text-red-600'}`}>
              {validationState.price.message}
            </p>
          )}
        </div>
        
        <div>
          <label className="text-sm font-medium">Количество</label>
          <Input
            type="number"
            value={formData.stock}
            onChange={(e) => setFormData(prev => ({ ...prev, stock: e.target.value }))}
            placeholder="0"
            min="0"
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium">URL изображения</label>
        <Input
          value={formData.imageUrl}
          onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
          placeholder="https://example.com/image.jpg"
        />
      </div>

      <div className="flex gap-2">
        <Button 
          type="button" 
          size="sm" 
          onClick={handleSave} 
          disabled={isSaving || isValidating.price || (validationState.price && !validationState.price.isValid)}
        >
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
              Сохранение...
            </>
          ) : (
            <>
              <Check className="h-4 w-4 mr-1" />
              Сохранить
            </>
          )}
        </Button>
        <Button type="button" size="sm" variant="outline" onClick={handleCancel}>
          <X className="h-4 w-4 mr-1" />
          Отмена
        </Button>
      </div>
    </form>
  );
}
