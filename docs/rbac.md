# Role-Based Access Control (RBAC)

## Vendor Roles (TrustfabricAdmin)
- `*` (All vendor permissions)

## Customer Roles
### EnterpriseAdmin
- Scope: `allowedCompanyIds = ['*']`
- Permissions: `*` (All customer permissions)

### CompanyAdmin
- Scope: `allowedCompanyIds = ['company-id-1', ...]`
- Permissions: 
  - `company.read`, `company.manage`
  - `user.read`, `user.manage`
  - `entitlement.read`
  - `license.read`, `license.allocate`, `license.suspend`, `license.revoke`
  - `installation.read`, `installation.manage`, `installation.enroll`
  - `license_request.read`, `license_request.create`, `license_request.approve`, `license_request.reject`, `license_request.cancel`

### User
- Scope: `allowedCompanyIds = ['company-id-1']`
- Permissions:
  - `license.read`
