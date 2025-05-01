using Xunit;
using Moq;
using ProductApi.Controllers;
using ProductApi.Models;
using ProductApi.Services;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

public class ProductsControllerTests
{
    private readonly ProductsController _controller;
    private readonly Mock<IProductService> _mockService;

    public ProductsControllerTests()
    {
        _mockService = new Mock<IProductService>(); // mock the interface
        _controller = new ProductsController(_mockService.Object);
    }

    [Fact]
    public void GetAllProducts_ReturnsOkWithProducts()
    {
        var products = new List<Product> {
            new Product { Id = 1, Name = "Laptop", Price = 1000 }
        };

        _mockService.Setup(s => s.GetAllProducts()).Returns(products);

        var result = _controller.GetAllProducts();

        var ok = Assert.IsType<OkObjectResult>(result.Result);
        var data = Assert.IsAssignableFrom<IEnumerable<Product>>(ok.Value);
        Assert.Single(data);
    }

    [Fact]
    public void GetProduct_ReturnsNotFound_WhenMissing()
    {
        _mockService.Setup(s => s.GetProduct(99)).Returns((Product)null);

        var result = _controller.GetProduct(99);

        Assert.IsType<NotFoundResult>(result.Result);
    }

    [Fact]
    public void AddProduct_ReturnsBadRequest_WhenInvalid()
    {
        _controller.ModelState.AddModelError("Name", "Required");

        var result = _controller.AddProduct(new Product());

        Assert.IsType<BadRequestObjectResult>(result.Result);
    }

    [Fact]
    public void AddProduct_ReturnsCreated_WhenValid()
    {
        var newProduct = new Product { Id = 5, Name = "Tablet", Price = 300 };

        _mockService.Setup(s => s.AddProduct(It.IsAny<Product>())).Returns(newProduct);

        var result = _controller.AddProduct(newProduct);

        var created = Assert.IsType<CreatedAtActionResult>(result.Result);
        var returned = Assert.IsType<Product>(created.Value);
        Assert.Equal("Tablet", returned.Name);
    }
}
