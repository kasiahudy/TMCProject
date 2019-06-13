package pl.gdansk.skpt.MapCreatorREST.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.gdansk.skpt.MapCreatorREST.model.SystemUser;
import pl.gdansk.skpt.MapCreatorREST.services.UserService;

import java.util.List;

/**
 * Controller for user operations.
 */
@RestController
@RequestMapping("/users")
public class UserController {

    final UserService userService;

    public UserController(UserService userService){
        this.userService = userService;
    }

    /**
     * Adds a new user.
     * @param systemUser User to add.
     * @return Status of the operation.
     */
    @PostMapping("/add")
    public ResponseEntity<String> addUser(@RequestBody SystemUser systemUser){
        if(userService.find(systemUser.getLogin()) == null){
            if(systemUser.getPrivilege() == SystemUser.PrivilegeLevels.SUPER_USER){
                return new ResponseEntity<>("Can't add another admin using API",HttpStatus.FORBIDDEN);
            }
            userService.save(systemUser);
            return new ResponseEntity<>("Added new systemUser", HttpStatus.OK);
        }
        else{
            return new ResponseEntity<>("Already exists", HttpStatus.CONFLICT);
        }
    }

    /**
     * Gets all users.
     * @return List of users.
     */
    @GetMapping()
    public List<SystemUser> getAllUsers(){
        return userService.getAllUsers();
    }

    /**
     * Removes a certain user.
     * @param systemUser User to remove.
     * @return Status of the operation.
     */
    @PostMapping("/remove")
    public ResponseEntity<String> deleteUser(@RequestBody SystemUser systemUser){
        if(userService.find(systemUser.getLogin()) != null){
            userService.remove(systemUser);
            return new ResponseEntity<>("Added new systemUser", HttpStatus.OK);
        }
        else{
            return new ResponseEntity<>("SystemUser does not exist", HttpStatus.BAD_REQUEST);
        }
    }
    
}
