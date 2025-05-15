import { Body, Controller, Delete, Get, Param, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { TestimonialsService } from './testimonials.service';
import { CreateTestimonialDto } from './dto/create-testimonial.dto';
import { UpdateTestimonialDto } from './dto/update-testimonial.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('testimonials')
export class TestimonialsController {
  constructor(private testimonialsService: TestimonialsService) {}

  @Get()
  findAll() {
    return this.testimonialsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.testimonialsService.findOne(id);
  }

  @Get('user/:userId')
  findByUser(@Param('userId') userId: string) {
    return this.testimonialsService.findByUser(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createTestimonialDto: CreateTestimonialDto, @Request() req) {
    return this.testimonialsService.create(createTestimonialDto, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTestimonialDto: UpdateTestimonialDto,
    @Request() req,
  ) {
    return this.testimonialsService.update(
      id,
      updateTestimonialDto,
      req.user.id,
      req.user.role,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.testimonialsService.remove(id, req.user.id, req.user.role);
  }
} 