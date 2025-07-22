import { Controller, Get, Post, Body, Param, Delete, ParseIntPipe, HttpException, HttpStatus } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { Category } from './entities/category.entity';

@Controller('api/categories')
export class CategoriesController {
  constructor(private readonly databaseService: DatabaseService) {}

  @Get()
  async findAll() {
    try {
      const categories = await this.databaseService.findAllCategoriesSimple();
      return {
        success: true,
        statusCode: 200,
        message: 'Categories retrieved successfully',
        data: categories,
        timestamp: new Date().toISOString(),
        path: '/api/categories',
        method: 'GET'
      };
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw new HttpException({
        success: false,
        statusCode: 500,
        timestamp: new Date().toISOString(),
        path: '/api/categories',
        method: 'GET',
        message: 'Database error occurred',
        error: 'Internal Server Error'
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post()
  async create(@Body() categoryData: Partial<Category>) {
    try {
      if (!categoryData.name) {
        throw new HttpException({
          success: false,
          statusCode: 400,
          timestamp: new Date().toISOString(),
          path: '/api/categories',
          method: 'POST',
          message: 'Category name is required',
          error: 'Bad Request'
        }, HttpStatus.BAD_REQUEST);
      }

      const category = await this.databaseService.createCategory(categoryData);
      return {
        success: true,
        statusCode: 201,
        message: 'Category created successfully',
        data: category,
        timestamp: new Date().toISOString(),
        path: '/api/categories',
        method: 'POST'
      };
    } catch (error) {
      console.error('Error creating category:', error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException({
        success: false,
        statusCode: 500,
        timestamp: new Date().toISOString(),
        path: '/api/categories',
        method: 'POST',
        message: 'Database error occurred',
        error: 'Internal Server Error'
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      const categories = await this.databaseService.findAllCategories();
      const category = categories.find(cat => cat.id === id);
      
      if (!category) {
        throw new HttpException({
          success: false,
          statusCode: 404,
          timestamp: new Date().toISOString(),
          path: `/api/categories/${id}`,
          method: 'GET',
          message: 'Category not found',
          error: 'Not Found'
        }, HttpStatus.NOT_FOUND);
      }

      return {
        success: true,
        statusCode: 200,
        message: 'Category retrieved successfully',
        data: category,
        timestamp: new Date().toISOString(),
        path: `/api/categories/${id}`,
        method: 'GET'
      };
    } catch (error) {
      console.error('Error fetching category:', error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException({
        success: false,
        statusCode: 500,
        timestamp: new Date().toISOString(),
        path: `/api/categories/${id}`,
        method: 'GET',
        message: 'Database error occurred',
        error: 'Internal Server Error'
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    try {
      const categories = await this.databaseService.findAllCategories();
      const category = categories.find(cat => cat.id === id);
      
      if (!category) {
        throw new HttpException({
          success: false,
          statusCode: 404,
          timestamp: new Date().toISOString(),
          path: `/api/categories/${id}`,
          method: 'DELETE',
          message: 'Category not found',
          error: 'Not Found'
        }, HttpStatus.NOT_FOUND);
      }

      // Note: This is a simplified delete. In a full implementation,
      // you'd want to handle product relationships properly
      await this.databaseService.deleteCategory(id);

      return {
        success: true,
        statusCode: 200,
        message: 'Category deleted successfully',
        timestamp: new Date().toISOString(),
        path: `/api/categories/${id}`,
        method: 'DELETE'
      };
    } catch (error) {
      console.error('Error deleting category:', error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException({
        success: false,
        statusCode: 500,
        timestamp: new Date().toISOString(),
        path: `/api/categories/${id}`,
        method: 'DELETE',
        message: 'Database error occurred',
        error: 'Internal Server Error'
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
