---
title: MCP Integration Guide
inclusion: always
description: Guide for using Model Context Protocol servers to extend team capabilities
---

# MCP Integration Guide

## Overview

Model Context Protocol (MCP) extends Dev Team Mode capabilities by connecting to specialized servers that provide additional tools and context. This enables the team to access AWS documentation, generate diagrams, analyze costs, and more.

## Configured MCP Servers

### 1. Fetch Server
**Purpose:** Web content fetching and HTTP requests  
**Use Cases:**
- Fetch external documentation
- Access public APIs
- Retrieve web resources

### 2. AWS Documentation Server
**Purpose:** Search and read official AWS documentation  
**Use Cases:**
- Look up AWS service documentation
- Get API reference information
- Find best practices and examples

**Example Usage:**
```
"Search AWS documentation for Lambda best practices"
"How do I configure API Gateway with Lambda?"
```

### 3. AWS Core Server
**Purpose:** Prompt understanding and AWS service translation  
**Use Cases:**
- Translate requirements to AWS services
- Understand AWS architecture patterns
- Get service recommendations

### 4. AWS API Server
**Purpose:** Execute AWS CLI commands  
**Use Cases:**
- Query AWS resources
- Check deployment status
- Retrieve configuration information

**Example Usage:**
```
"List all Lambda functions in the account"
"Get the status of CloudFormation stack"
```

### 5. AWS Knowledge Server
**Purpose:** Advanced AWS knowledge base access  
**Use Cases:**
- Deep technical guidance
- Architecture recommendations
- Troubleshooting assistance

### 6. AWS CDK Server
**Purpose:** AWS CDK guidance and stack generation  
**Use Cases:**
- Generate CDK stacks
- Get CDK best practices
- Convert CloudFormation to CDK

**Example Usage:**
```
"Generate a CDK stack for a serverless API"
"Show me CDK patterns for event-driven architecture"
```

### 7. AWS Terraform Server
**Purpose:** Terraform AWS provider documentation and execution  
**Use Cases:**
- Search AWS and AWSCC provider docs
- Execute Terraform commands
- Run Checkov security scans
- Search Terraform registry modules

**Example Usage:**
```
"Search Terraform AWS provider for Lambda configuration"
"Run terraform plan and show me the changes"
"Scan my Terraform code for security issues"
```

### 8. AWS Serverless Server
**Purpose:** Serverless application guidance and deployment  
**Use Cases:**
- Serverless architecture patterns
- SAM template generation
- Deploy serverless applications
- Get CloudWatch metrics

**Example Usage:**
```
"Generate a SAM template for a REST API"
"Deploy my serverless application"
"Show me Lambda function metrics"
```

### 9. AWS Diagram Server
**Purpose:** Generate architecture diagrams with official AWS icons  
**Use Cases:**
- Create architecture diagrams
- Generate flow charts
- Create sequence diagrams
- Export to Draw.IO format

**Example Usage:**
```
"Generate an architecture diagram for my serverless API"
"Create a sequence diagram for the authentication flow"
"Show me available AWS icons"
```

**Auto-approved tools:**
- `get_diagram_examples` - Get diagram examples
- `list_icons` - List available AWS icons
- `generate_diagram` - Generate diagrams

### 10. AWS Pricing Server
**Purpose:** AWS cost analysis and pricing calculations  
**Use Cases:**
- Analyze CDK/Terraform project costs
- Query AWS pricing API
- Generate cost reports
- Compare regional pricing

**Example Usage:**
```
"Calculate the cost of my Terraform infrastructure"
"Compare Lambda pricing in us-east-1 vs eu-west-1"
"Generate a cost report for my project"
```

**Auto-approved tools:**
- `get_pricing_service_codes` - Get available service codes

## Best Practices

### 1. Leverage MCP for Documentation
Instead of guessing AWS configurations, use MCP servers to fetch current documentation:
```
"Use AWS docs MCP to find the latest Lambda runtime versions"
"Search AWS Terraform provider docs for API Gateway configuration"
```

### 2. Generate Diagrams Early
Use the diagram server during design phase:
```
"Generate an architecture diagram for the design document"
"Create a sequence diagram showing the data flow"
```

### 3. Cost Analysis Before Deployment
Use pricing server to estimate costs:
```
"Analyze the cost of this Terraform module"
"Compare costs across eu-west-1, eu-central-1, and eu-north-1"
```

### 4. Security Scanning
Use Terraform server for security checks:
```
"Run Checkov scan on my Terraform code"
"Check for security issues in my infrastructure code"
```

### 5. Validate Against Best Practices
Use knowledge and docs servers to validate designs:
```
"Check if my Lambda configuration follows AWS best practices"
"Validate my API Gateway setup against AWS recommendations"
```

## Integration with Dev Team Roles

### Product Owner
- Use AWS Knowledge for architecture recommendations
- Use Pricing server for cost estimates in requirements

### Tech Lead
- Use Diagram server for architecture documentation
- Use AWS Docs for technical validation
- Use Terraform server for infrastructure review

### Developer
- Use AWS API for resource queries
- Use CDK/Terraform servers for IaC development
- Use Serverless server for deployment

### QA Engineer
- Use AWS API to verify deployments
- Use Serverless server to check metrics
- Use Terraform server for security scanning

### DevOps Engineer
- Use Terraform server for infrastructure management
- Use Pricing server for cost optimization
- Use Diagram server for documentation

## Auto-Approval Configuration

Some MCP tools are auto-approved for efficiency:

**Diagram Server:**
- `get_diagram_examples` - Safe, read-only
- `list_icons` - Safe, read-only
- `generate_diagram` - Safe, generates images

**Pricing Server:**
- `get_pricing_service_codes` - Safe, read-only

**Terraform Server:**
- `SearchAwsProviderDocs` - Safe, read-only

Other tools require manual approval for safety.

## Troubleshooting

### MCP Server Not Responding
1. Check if `uv` and `uvx` are installed
2. Verify network connectivity
3. Check MCP server logs in Kiro
4. Try restarting the MCP server from Kiro UI

### Installation
If `uvx` is not installed:
```bash
# macOS/Linux with Homebrew
brew install uv

# Or use pip
pip install uv

# Windows
pip install uv
```

### Disable Problematic Servers
If a server causes issues, disable it temporarily:
```json
{
  "mcpServers": {
    "awslabs-api": {
      "disabled": true
    }
  }
}
```

## Configuration Location

**Workspace Config:** `.kiro/settings/mcp.json`  
**Scope:** Local to this Dev Team Mode workspace  
**Version Control:** Should be committed to Git for team consistency

## Updates

MCP servers are automatically updated to `@latest` versions. To pin a specific version:
```json
{
  "mcpServers": {
    "awslabs-docs": {
      "args": ["awslabs.aws-documentation-mcp-server@1.2.3"]
    }
  }
}
```

## Resources

- [MCP Official Documentation](https://modelcontextprotocol.io/)
- [AWS MCP Servers](https://github.com/awslabs/mcp)
- [Kiro MCP Guide](https://kiro.dev/docs/mcp/)

---

**Last Updated:** 2026-03-02  
**Version:** 1.0.0
