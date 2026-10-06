import {
    CanActivate,
    ExecutionContext,
    Injectable
    }
    from "@nestjs/common";
    
    import { Reflector }
    from "@nestjs/core";
    
    
    @Injectable()
    
    export class RolesGuard
    implements CanActivate{
    
    
    constructor(
    private reflector:Reflector
    ){}
    
    
    
    canActivate(
    context:ExecutionContext
    ){
    
    
    const roles =
    this.reflector.get<string[]>(
    "roles",
    context.getHandler()
    );
    
    
    
    if(!roles){
    
    return true;
    
    }
    
    
    
    const request =
    context.switchToHttp()
    .getRequest();
    
    
    
    const user =
    request.user;
    
    
    
    return roles.includes(
    user.role
    );
    
    
    }
    
    }
    // Apply kuri Create User API
    // users.controller.ts
    
    // @Post()
    
    // @Roles("ADMIN")
    
    // @UseGuards(
    // JwtAuthGuard,
    // RolesGuard
    // )
    
    // createUser(
    // @Body() data:any
    // ){
    
    // return this.service.createUser(data);
    
    // }
    // Ubu ADMIN gusa niwe ushobora gukora user.