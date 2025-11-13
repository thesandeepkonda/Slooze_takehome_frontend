package com.slooze.controller;

import com.slooze.model.User;
import com.slooze.repo.InMemoryStore;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/dashboard")
public class DashboardController {

    private User getUserFromToken(String token) {
        String email = InMemoryStore.sessions.get(token);
        if (email == null) return null;
        return InMemoryStore.users.get(email);
    }

    @GetMapping("/summary")
    public ResponseEntity<?> summary(@RequestHeader(value="Authorization", required=false) String auth) {
        if (auth == null || !auth.startsWith("Bearer ")) {
            return ResponseEntity.status(401).body(Collections.singletonMap("error","unauthenticated"));
        }
        String token = auth.substring(7);
        User u = getUserFromToken(token);
        if (u == null) return ResponseEntity.status(401).body(Collections.singletonMap("error","invalid session"));
        if (!"MANAGER".equals(u.getRole())) {
            return ResponseEntity.status(403).body(Collections.singletonMap("error","forbidden: managers only"));
        }
        // compute simple stats
        int totalProducts = InMemoryStore.products.size();
        int totalQuantity = InMemoryStore.products.values().stream().mapToInt(p -> p.getQuantity()).sum();
        double totalValue = InMemoryStore.products.values().stream().mapToDouble(p -> p.getQuantity() * p.getPrice()).sum();
        Map<String,Object> m = new HashMap<>();
        m.put("totalProducts", totalProducts);
        m.put("totalQuantity", totalQuantity);
        m.put("totalValue", totalValue);
        return ResponseEntity.ok(m);
    }
}
