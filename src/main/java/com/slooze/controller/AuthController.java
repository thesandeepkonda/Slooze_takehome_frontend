package com.slooze.controller;

import com.slooze.model.User;
import com.slooze.repo.InMemoryStore;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String,String> body) {
        String email = body.get("email");
        String password = body.get("password");
        if (email == null || password == null) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("error","email/password required"));
        }
        User u = InMemoryStore.users.get(email);
        if (u == null || !u.getPassword().equals(password)) {
            return ResponseEntity.status(401).body(Collections.singletonMap("error","invalid credentials"));
        }
        String token = UUID.randomUUID().toString();
        InMemoryStore.sessions.put(token, email);
        Map<String,Object> resp = new HashMap<>();
        resp.put("token", token);
        resp.put("role", u.getRole());
        resp.put("email", u.getEmail());
        return ResponseEntity.ok(resp);
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestHeader(value="Authorization", required=false) String auth) {
        if (auth != null && auth.startsWith("Bearer ")) {
            String token = auth.substring(7);
            InMemoryStore.sessions.remove(token);
        }
        return ResponseEntity.ok(Collections.singletonMap("ok", true));
    }
}
