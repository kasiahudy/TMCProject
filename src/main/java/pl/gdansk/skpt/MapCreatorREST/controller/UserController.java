package pl.gdansk.skpt.MapCreatorREST.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pl.gdansk.skpt.MapCreatorREST.model.User;
import pl.gdansk.skpt.MapCreatorREST.services.UserService;

@RestController
@RequestMapping("/users")
public class UserController {

    final UserService userService;

    public UserController(UserService userService){
        this.userService = userService;
    }

    @PostMapping("/add")
    public ResponseEntity<String> CreateUser(@RequestBody User user){
        if(userService.find(user.getLogin()) == null){
            userService.save(user);
            return new ResponseEntity<>("Added new user", HttpStatus.OK);
        }
        else{
            return new ResponseEntity<>("Already exists", HttpStatus.CONFLICT);
        }
    }
    
}
