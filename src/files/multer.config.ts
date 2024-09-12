import { Injectable } from "@nestjs/common";
import { MulterModuleOptions, MulterOptionsFactory } from "@nestjs/platform-express";
import fs from 'fs'
import { diskStorage } from "multer";
import path, { join } from "path";

@Injectable()
export class MulterConfigService implements MulterOptionsFactory {
    //this function returns the link to our root file
    getRootPath = () => {
        return process.cwd();
    };

    //this check is the file ain't exist, it's gonna create for us 
    ensureExists(targetDirectory: string) {
        fs.mkdir(targetDirectory, { recursive: true }, (error) => {
            if (!error) {
                console.log('Directory successfully created, or it already exists.');
                return;
            }
            switch (error.code) {
                case 'EEXIST':
                    // Error:
                    // Requested location already exists, but it's not a directory.
                    break;
                case 'ENOTDIR':
                    // Error:
                    // The parent hierarchy contains a file with the same name as the dir
                    // you're trying to create.
                    break;
                default:
                    // Some other error like permission denied.
                    console.error(error);
                    break;
            }
        });
    }

    createMulterOptions(): MulterModuleOptions {
        return {
            //this storage var helps us config where we wanna store our uploaded files
            storage: diskStorage({  //diskStorage is our backend source code
                destination: (req, file, cb) => {   //
                    const folder = req?.headers?.folder_type ?? "default";
                    this.ensureExists(`public/images/${folder}`);
                    cb(null, join(this.getRootPath(), `public/images/${folder}`))
                },
                filename: (req, file, cb) => {  //helps us change our files names
                    //get file extension
                    let extName = path.extname(file.originalname);  

                    //get file's name (without extension)
                    let baseName = path.basename(file.originalname, extName);

                    let finalName = `${baseName}-${Date.now()}${extName}`   //joining to create a random string
                    cb(null, finalName)
                }
            })
        };
    }
}
