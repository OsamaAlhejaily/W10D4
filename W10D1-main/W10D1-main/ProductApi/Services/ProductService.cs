using ProductApi.Models;
using ProductApi.Configuration;
using Microsoft.Extensions.Options;

namespace ProductApi.Services
{
    public interface IProductService
    {
        List<Product> GetAllProducts();
        Product? GetProduct(int id);
        Product AddProduct(Product product);
    }

    public class ProductService : IProductService
    {
        private readonly List<Product> _products;
        private readonly AppSettings _appSettings;
        private int _nextId = 1;

        public ProductService(IOptions<AppSettings> appSettings)
        {
            _appSettings = appSettings.Value;
            
            // In-memory product list
            _products = new List<Product>
            {
                new Product { Id = _nextId++, Name = "Laptop", Description = "High-performance laptop", Price = 1200, Currency = _appSettings.DefaultCurrency },
                new Product { Id = _nextId++, Name = "Smartphone", Description = "Latest smartphone", Price = 800, Currency = _appSettings.DefaultCurrency },
                new Product { Id = _nextId++, Name = "Headphones", Description = "Noise-canceling headphones", Price = 250, Currency = _appSettings.DefaultCurrency }
            };
        }

        public List<Product> GetAllProducts()
        {
            return _products;
        }

        public Product? GetProduct(int id)
        {
            return _products.FirstOrDefault(p => p.Id == id);
        }

        public Product AddProduct(Product product)
        {
            product.Id = _nextId++;
            
            // Set default currency if not provided
            if (string.IsNullOrEmpty(product.Currency))
            {
                product.Currency = _appSettings.DefaultCurrency;
            }
            
            _products.Add(product);
            return product;
        }
    }
}