package pl.gdansk.skpt.MapCreatorREST.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.gdansk.skpt.MapCreatorREST.model.SystemUser;
import pl.gdansk.skpt.MapCreatorREST.services.UserService;

import java.util.List;

@RestController
@RequestMapping("/users")
public class UserController {

    final UserService userService;

    public UserController(UserService userService){
        this.userService = userService;
    }

    @CrossOrigin(origins = "http://localhost:4200")
    @PostMapping("/add")
    public ResponseEntity<String> CreateUser(@RequestBody SystemUser systemUser){
        if(userService.find(systemUser.getLogin()) == null){
            userService.save(systemUser);
            return new ResponseEntity<>("Added new systemUser", HttpStatus.OK);
        }
        else{
            return new ResponseEntity<>("Already exists", HttpStatus.CONFLICT);
        }
    }

    @GetMapping()
    public List<SystemUser> GetAllUsers(){
        return userService.getAllUsers();
    }

    @CrossOrigin(origins = "http://localhost:4200")
    @PostMapping("/remove")
    public ResponseEntity<String> DeleteUser(@RequestBody SystemUser systemUser){
        if(userService.find(systemUser.getLogin()) != null){
            userService.remove(systemUser);
            return new ResponseEntity<>("Added new systemUser", HttpStatus.OK);
        }
        else{
            return new ResponseEntity<>("SystemUser does not exist", HttpStatus.BAD_REQUEST);
        }
    }
    
}
