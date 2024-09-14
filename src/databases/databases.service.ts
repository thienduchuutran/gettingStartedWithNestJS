import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Permission, PermissionDocument } from 'src/permissions/schemas/permission.schema';
import { Role, RoleDocument } from 'src/roles/schemas/role.schema';
import { User, UserDocument } from 'src/users/schemas/user.schema';
import { ADMIN_ROLE, INIT_PERMISSIONS, USER_ROLE } from './sample';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class DatabasesService implements OnModuleInit{  //this function will run after all modules and dependencies run successfully
  private readonly logger = new Logger(DatabasesService.name)
  
  constructor(
    @InjectModel(User.name) //gotta inject the company schema here to interact with company schema in db
    private userModel: SoftDeleteModel<UserDocument>,

    @InjectModel(Permission.name) 
    private permissionModel: SoftDeleteModel<PermissionDocument>,

    @InjectModel(Role.name)
    private roleModel: SoftDeleteModel<RoleDocument>,

    private configService: ConfigService,
    private userService: UsersService
  ) {}  
  
    async onModuleInit(){
      const isInit = this.configService.get<string>("SHOULD_INIT");
        if (Boolean(isInit)) {

            //counting records in these schemas as we only generate data if 0 records in these schemas
            const countUser = await this.userModel.count({});
            const countPermission = await this.permissionModel.count({});
            const countRole = await this.roleModel.count({});

            //gotta create permissions first since roles stem from permissions
            if (countPermission === 0) {
                await this.permissionModel.insertMany(INIT_PERMISSIONS);  //a list of permissions
                //bulk create
            }

            // checking if permissions exist, then create role
            if (countRole === 0) {  //nothing passed in find({}) to get all permissons, then select only "id" field of permissions
                const permissions = await this.permissionModel.find({}).select("_id");// since in dto we set permissions as an array only containing object ids
                //this is when we create a new role
                await this.roleModel.insertMany([
                    {
                        name: ADMIN_ROLE,
                        description: "Admins have full authority",
                        isActive: true,
                        permissions: permissions
                    },
                    {
                        name: USER_ROLE,
                        description: "Users using the app",
                        isActive: true,
                        permissions: [] //không set quyền, chỉ cần add ROLE
                    }
                ]);
            }

            if (countUser === 0) {
                const adminRole = await this.roleModel.findOne({ name: ADMIN_ROLE });
                const userRole = await this.roleModel.findOne({ name: USER_ROLE })
                await this.userModel.insertMany([
                    {
                        name: "I'm admin",
                        email: "admin@gmail.com",
                        password: this.userService.getHashPassword(this.configService.get<string>("INIT_PASSWORD")),
                        age: 20,
                        gender: "MALE",
                        address: "VietNam",
                        role: adminRole?._id
                    },
                    {
                        name: "I'm Hỏi Dân IT",
                        email: "hoidanit@gmail.com",
                        password: this.userService.getHashPassword(this.configService.get<string>("INIT_PASSWORD")),
                        age: 96,
                        gender: "MALE",
                        address: "VietNam",
                        role: adminRole?._id
                    },
                    {
                        name: "I'm normal user",
                        email: "user@gmail.com",
                        password: this.userService.getHashPassword(this.configService.get<string>("INIT_PASSWORD")),
                        age: 35,
                        gender: "MALE",
                        address: "VietNam",
                        role: userRole?._id
                    },
                ])
            }

            if (countUser > 0 && countRole > 0 && countPermission > 0) {
                this.logger.log('>>> ALREADY INIT SAMPLE DATA...');
            }
        }
      }
}
