package com.slooze.controller;

import com.slooze.model.Product;
import com.slooze.model.User;
import com.slooze.repo.InMemoryStore;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/products")
public class ProductController {

    private User getUserFromToken(String token) {
        String email = InMemoryStore.sessions.get(token);
        if (email == null) return null;
        return InMemoryStore.users.get(email);
    }

    @GetMapping
    public ResponseEntity<?> all(@RequestHeader(value="Authorization", required=false) String auth) {
        // open to both roles but require valid token
        if (auth == null || !auth.startsWith("Bearer ")) {
            return ResponseEntity.status(401).body(Collections.singletonMap("error","unauthenticated"));
        }
        String token = auth.substring(7);
        User u = getUserFromToken(token);
        if (u == null) return ResponseEntity.status(401).body(Collections.singletonMap("error","invalid session"));
        List<Product> list = new ArrayList<>(InMemoryStore.products.values());
        return ResponseEntity.ok(list);
    }

    @PostMapping
    public ResponseEntity<?> add(@RequestHeader(value="Authorization", required=false) String auth,
                                 @RequestBody Product p) {
        if (auth == null || !auth.startsWith("Bearer ")) {
            return ResponseEntity.status(401).body(Collections.singletonMap("error","unauthenticated"));
        }
        String token = auth.substring(7);
        User u = getUserFromToken(token);
        if (u == null) return ResponseEntity.status(401).body(Collections.singletonMap("error","invalid session"));
        // both Manager and Store Keeper can add/edit per spec
        Product saved = InMemoryStore.saveProduct(p);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> edit(@RequestHeader(value="Authorization", required=false) String auth,
                                  @PathVariable Long id, @RequestBody Product p) {
        if (auth == null || !auth.startsWith("Bearer ")) {
            return ResponseEntity.status(401).body(Collections.singletonMap("error","unauthenticated"));
        }
        String token = auth.substring(7);
        User u = getUserFromToken(token);
        if (u == null) return ResponseEntity.status(401).body(Collections.singletonMap("error","invalid session"));
        Product existing = InMemoryStore.products.get(id);
        if (existing == null) return ResponseEntity.status(404).body(Collections.singletonMap("error","not found"));
        existing.setName(p.getName());
        existing.setCategory(p.getCategory());
        existing.setQuantity(p.getQuantity());
        existing.setPrice(p.getPrice());
        InMemoryStore.saveProduct(existing);
        return ResponseEntity.ok(existing);
    }
}
