import { Body, Controller, Get, Param, Patch, Request } from '@nestjs/common';
import { CompaniesService } from './companies.service.js';
import { RequirePermissions } from '../auth/permissions.decorator.js';

@Controller('customer/companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Get()
  @RequirePermissions('company.read')
  async findAll(@Request() req: any) {
    return this.companiesService.findAll(req.user.allowedCompanyIds);
  }

  @Get(':id')
  @RequirePermissions('company.read')
  async findOne(@Param('id') id: string, @Request() req: any) {
    return this.companiesService.findOne(id, req.user.allowedCompanyIds);
  }

  @Patch(':id/email-domains')
  @RequirePermissions('company.manage')
  async setAllowedEmailDomains(
    @Param('id') id: string,
    @Body('allowedEmailDomains') allowedEmailDomains: string[],
    @Request() req: any,
  ) {
    return this.companiesService.setAllowedEmailDomains(id, allowedEmailDomains, req.user.allowedCompanyIds, req.user.id);
  }
}
