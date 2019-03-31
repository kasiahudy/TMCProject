package pl.gdansk.skpt.MapCreatorREST.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pl.gdansk.skpt.MapCreatorREST.model.SystemUser;
import pl.gdansk.skpt.MapCreatorREST.services.UserService;

@RestController
@RequestMapping("/users")
public class UserController {

    final UserService userService;

    public UserController(UserService userService){
        this.userService = userService;
    }

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
